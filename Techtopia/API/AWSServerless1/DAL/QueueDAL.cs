using Microsoft.EntityFrameworkCore;
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
                    RedemptionQueue queue = null;
                    var qVisitor = from q in context.RedemptionQueues
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
                    var qVisitorQueue = from q in context.RedemptionQueues
                                        where q.VisitorId == visitorId
                                        && q.DateEngravingStart == null
                                        && q.DatePendingCollection == null
                                        && q.DateCollected == null
                                        orderby q.DateJoined descending
                                        select q;
                    if (qVisitorQueue != null && qVisitorQueue.Count() > 0)
                    {
                        var visitorQ = qVisitorQueue.First();
                        var qVisitorsInQueue = from q in context.RedemptionQueues
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

        public static List<RedemptionQueue> GetTopQueue(QUEUE_STATUS queueStatus, int top = -1)
        {
            List<RedemptionQueue> result = new List<RedemptionQueue>();

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qTopQueue = (from q in context.RedemptionQueues
                                     where
                                     (queueStatus == QUEUE_STATUS.IN_QUEUE && q.DateEngravingStart == null && q.DatePendingCollection == null && q.DateCollected == null)
                                     || (queueStatus == QUEUE_STATUS.ENGRAVING && q.DateEngravingStart != null && q.DatePendingCollection == null && q.DateCollected == null)
                                     || (queueStatus == QUEUE_STATUS.PENDING_COLLECTION && q.DateEngravingStart != null && q.DatePendingCollection != null && q.DateCollected == null)
                                     || (queueStatus == QUEUE_STATUS.COLLECTED && q.DateEngravingStart != null && q.DatePendingCollection != null && q.DateCollected != null)
                                     orderby q.DateJoined ascending // First joined in the first of queue
                                     select q);
                    if (qTopQueue != null)
                    {
                        if (top == -1)
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
                Console.WriteLine($"An Exception have occurred while GetTopQueue(top: {top}) - {ex.Message}");
            }

            return result;
        }
    }
}
