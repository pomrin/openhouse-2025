using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.DAL
{
    public static class VisitorDAL
    {
        public static Visitor RegisterVisitor()
        {
            Visitor result = null;
            using (var context = new Openhouse25Context())
            {

                Visitor visitorCreated = new Visitor()
                {
                };

                context.Visitors.Add(visitorCreated);
                context.SaveChanges();
                result = visitorCreated;

                visitorCreated.TicketId = "NYP" + visitorCreated.VisitorId.ToString("0000") + DateTime.Now.ToString("ddd").ToUpper(); // Required as AWS RDS MySQL have issues creating a Trigger
                context.SaveChanges();

            }

            return result;
        }

        public static Visitor GetVisitorByTicketId(String ticketId)
        {
            Visitor result = null;
            try
            {
                if (!String.IsNullOrEmpty(ticketId))
                {
                    ticketId = ticketId.Trim().ToUpper();
                }
                using (var context = new Openhouse25Context())
                {
                    var qVisitorByTicketId = from q in context.Visitors
                                             where q.TicketId.Trim().ToUpper() == ticketId
                                             select q;
                    if (qVisitorByTicketId != null && qVisitorByTicketId.Count() > 0)
                    {
                        if (qVisitorByTicketId.Count() == 1)
                        {
                            result = qVisitorByTicketId.First();
                        }
                        else
                        {
                            Console.WriteLine($"Detected multiple Visitor for Ticket ID - {ticketId}!");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetVisitorByTicketId({ticketId}) - {ex.Message}");
            }

            return result;
        }

        internal static Visitor RedeemLuggageTag(int visitorId, LuggageTagColor luggageTagColor)
        {
            Visitor result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorToUpdate = from q in context.Visitors
                                           where q.VisitorId == visitorId
                                           select q;
                    if (qVisitorToUpdate != null)
                    {
                        var visitorToUpdate = qVisitorToUpdate.First();
                        visitorToUpdate.LuggageRedeemedDate = DateTime.Now;
                        visitorToUpdate.LuggageTagColorName = luggageTagColor.LuggageTagColorName;
                        context.SaveChanges();
                        result = visitorToUpdate;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in VisitorRedemption(visitorId: {visitorId}, luggageTagColor: {luggageTagColor.LuggageTagColorName}) - {ex.Message}");
            }

            return result;


        }

        internal static Visitor UpdateRedemptionInformation(int visitorId, LuggageTagColor luggageTagColor)
        {
            Visitor result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorToUpdate = from q in context.Visitors
                                           where q.VisitorId == visitorId
                                           select q;
                    if (qVisitorToUpdate != null)
                    {
                        var visitorToUpdate = qVisitorToUpdate.First();
                        visitorToUpdate.LuggageTagColorName = luggageTagColor.LuggageTagColorName;
                        context.SaveChanges();
                        result = visitorToUpdate;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in UpdateRedemptionInformation(visitorId: {visitorId}, luggageTagColor: {luggageTagColor.LuggageTagColorName}) - {ex.Message}");
            }

            return result;
        }

        internal static List<Visitor> GetAllVisitors()
        {
            var result = new List<Visitor>();

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qSortedVisitor = from q in context.Visitors
                                         orderby q.VisitorId ascending
                                         select q;
                    result.AddRange(qSortedVisitor.ToList());
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetAllVisitors() - {ex.Message}");
            }

            return result;
        }



        public static List<Visitor> GetAllVisitorsIncludeVisitorBooths(int limit = 0)
        {
            var result = new List<Visitor>();

            try
            {
                using (var context = new Openhouse25Context())
                {

                    var qVisitor = (from q in context.Visitors
                                    select q).Include(qVisitor => qVisitor.VisitorBooths);
                    if (qVisitor != null)
                    {
                        if (limit > 0)
                        {
                            result.AddRange(qVisitor.Take(limit).ToList());
                        }
                        else
                        {
                            result.AddRange(qVisitor.ToList());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = null;
                Console.WriteLine($"An Exception have occurred in GetAllVisitorsAndVisitorBooths() - {ex.Message}");
            }

            return result;
        }

        internal static Visitor RemoveVisitorPhotoByVisitorId(int visitorId)
        {
            Visitor result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorToUpdate = from q in context.Visitors
                                           where q.VisitorId == visitorId
                                           select q;
                    if (qVisitorToUpdate != null)
                    {
                        var visitorToUpdate = qVisitorToUpdate.First();
                        visitorToUpdate.ProfileImageUrl = null;
                        context.SaveChanges();
                        result = visitorToUpdate;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in RemoveVisitorPhotoByVisitorId(visitorId: {visitorId}) - {ex.Message}");
            }

            return result;
        }
    }
}
