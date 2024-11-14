using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;
using ProjectEFEntities.OH25EntityModels;
using System.Collections.Generic;

namespace AWSServerless1.DAL
{
    public static class QueueDAL
    {

        public enum QUEUE_STATUS { NOT_IN_QUEUE, IN_QUEUE, ENGRAVING, PENDING_COLLECTION, COLLECTED }
        public static QUEUE_STATUS GetQueueStatusVisitor(int visitorId)
        {
            QUEUE_STATUS result = QUEUE_STATUS.NOT_IN_QUEUE;
            try
            {

                using (var context = new Openhouse25Context())
                {
                    EngravingQueue queue = null;
                    var qVisitor = from q in context.EngravingQueues
                                   where q.VisitorId == visitorId
                                   orderby q.DateJoined descending
                                   select q;
                    if (qVisitor != null)
                    {
                        queue = qVisitor.First();
                    }
                    if (queue == null)
                    {
                        result = QUEUE_STATUS.NOT_IN_QUEUE;
                    }
                    else
                    {
                        if (queue.DateEngravingStart == null
                            && queue.DatePendingCollection == null
                            && queue.DateCollected == null)
                        {
                            result = QUEUE_STATUS.IN_QUEUE;
                        }
                        else if (queue.DateEngravingStart != null
                               && queue.DatePendingCollection == null
                               && queue.DateCollected == null)
                        {
                            result = QUEUE_STATUS.ENGRAVING;
                        }
                        else if (queue.DateEngravingStart != null
                            && queue.DatePendingCollection != null
                            && queue.DateCollected == null)
                        {
                            result = QUEUE_STATUS.PENDING_COLLECTION;
                        }
                        else
                        {
                            result = QUEUE_STATUS.COLLECTED;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Error have occurred in GetQueeuStatusVisitor(visitorId: {visitorId}) - {ex.Message}");
            }

            return result;
        }

        public static int GetQueueVisitor(int visitorId)
        {
            int result = -1;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorQueue = from q in context.EngravingQueues
                                        where q.VisitorId == visitorId
                                        && q.DateEngravingStart == null
                                        && q.DatePendingCollection == null
                                        && q.DateCollected == null
                                        orderby q.DateJoined descending
                                        select q;
                    if (qVisitorQueue != null && qVisitorQueue.Count() > 0)
                    {
                        var visitorQ = qVisitorQueue.First();
                        var qVisitorsInQueue = from q in context.EngravingQueues
                                               where q.DateEngravingStart == null
                                               && q.DatePendingCollection == null
                                               && q.DateCollected == null
                                               && q.DateJoined < visitorQ.DateJoined
                                               orderby q.DateJoined
                                               select q;
                        if (qVisitorsInQueue != null)
                        {
                            result = qVisitorsInQueue.Count();
                        }
                    }
                    else
                    {
                        // No valid queue
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occured in GetQueueVisitor({visitorId}) - {ex.Message}");
            }

            return result;
        }

        public static List<EngravingQueue> GetTopQueue(QUEUE_STATUS queueStatus, int top = 0)
        {
            List<EngravingQueue> result = new List<EngravingQueue>();

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qTopQueue = (from q in context.EngravingQueues
                                     where
                                     (queueStatus == QUEUE_STATUS.IN_QUEUE && q.DateEngravingStart == null && q.DatePendingCollection == null && q.DateCollected == null)
                                     || (queueStatus == QUEUE_STATUS.ENGRAVING && q.DateEngravingStart != null && q.DatePendingCollection == null && q.DateCollected == null)
                                     || (queueStatus == QUEUE_STATUS.PENDING_COLLECTION && q.DateEngravingStart != null && q.DatePendingCollection != null && q.DateCollected == null)
                                     || (queueStatus == QUEUE_STATUS.COLLECTED && q.DateEngravingStart != null && q.DatePendingCollection != null && q.DateCollected != null)
                                     orderby q.DateJoined ascending // First joined in the first of queue
                                     select q);
                    if (qTopQueue != null)
                    {
                        if (top <= 0)
                        {
                            result.AddRange(qTopQueue.Include(q => q.Visitor).ToList());
                        }
                        else
                        {
                            result.AddRange(qTopQueue.Take(Math.Min(qTopQueue.Count(), top)).Include(q => q.Visitor));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetTopQueue(top: {top}) - {ex.Message}");
            }

            return result;
        }

        internal static EngravingQueue AddToQueue(int visitorId, DTO.AddToQueueDTO addToQueueInfo)
        {
            EngravingQueue queue = null;
            try
            {
                using (var context = new Openhouse25Context())
                {
                    var isAlreadyInQueue = from q in context.EngravingQueues
                                           where q.VisitorId == visitorId
                                           select q;
                    if (isAlreadyInQueue != null)
                    {
                        var isExist = isAlreadyInQueue.Count() > 0;
                        if (isExist)
                        {
                            Console.WriteLine($"Queue already exist. No insertion required.");
                            // Already in the queue, no need to add.
                            queue = isAlreadyInQueue.First();
                        }
                        else
                        {
                            var queueToInsert = new EngravingQueue()
                            {
                                VisitorId = visitorId,
                                DateJoined = DateTime.Now,
                                EngravingText = addToQueueInfo.EngravingText,
                                LuggageTagColor = addToQueueInfo.LuggageTagColor,
                            };
                            context.EngravingQueues.Add(queueToInsert);
                            context.SaveChanges();
                            queue = queueToInsert;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in AddToQueue(visitorId: {visitorId}) - {ex.Message}");
            }
            return queue;
        }

        internal static EngravingQueue UpdateQueue(int visitorId, QUEUE_STATUS queueStatus)
        {
            EngravingQueue result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qCurrentQueue = from q in context.EngravingQueues
                                        where q.VisitorId == visitorId
                                        select q;
                    if (qCurrentQueue != null)
                    {
                        var queueToUpdate = qCurrentQueue.First();
                        switch (queueStatus)
                        {
                            case QUEUE_STATUS.NOT_IN_QUEUE:
                                context.EngravingQueues.Remove(queueToUpdate);
                                break;
                            case QUEUE_STATUS.IN_QUEUE:
                                queueToUpdate.DateEngravingStart = null;
                                queueToUpdate.DatePendingCollection = null;
                                queueToUpdate.DateCollected = null;
                                break;
                            case QUEUE_STATUS.ENGRAVING:
                                if (queueToUpdate.DateEngravingStart == null)
                                {
                                    queueToUpdate.DateEngravingStart = DateTime.Now;
                                }
                                queueToUpdate.DatePendingCollection = null;
                                queueToUpdate.DateCollected = null;
                                break;
                            case QUEUE_STATUS.PENDING_COLLECTION:
                                if (queueToUpdate.DatePendingCollection == null)
                                {
                                    queueToUpdate.DatePendingCollection = DateTime.Now;
                                }
                                queueToUpdate.DateCollected = null;
                                break;
                            case QUEUE_STATUS.COLLECTED:
                                if (queueToUpdate.DateCollected == null)
                                {
                                    queueToUpdate.DateCollected = DateTime.Now;
                                }
                                break;
                            default:
                                Console.WriteLine($"Unsupported status - {queueStatus} for visitorId {visitorId}!");
                                break;
                        }
                        context.SaveChanges();
                        result = queueToUpdate;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in UpdateQueue(visitorId: {visitorId}, QUEUE_STATUS: {queueStatus}) - {ex.Message}");
            }
            return result;
        }

        internal static EngravingQueue? UpdateEngravingText(int visitorId, string engravingText)
        {
            EngravingQueue queue = null;
            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitor = from q in context.EngravingQueues
                                   where q.VisitorId == visitorId
                                   select q;
                    if (qVisitor != null && qVisitor.Count() > 0)
                    {
                        queue = qVisitor.First();
                        queue.EngravingText = engravingText;
                        context.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in UpdateEngravingText(visitorId: {visitorId}, engravingText: {engravingText}) - {ex.Message}");
            }
            return queue;
        }
    }
}
