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
                Console.WriteLine($"An Exception have occurred in GetVisitorByTicketId({ticketId} - {ex.Message}");
            }

            return result;
        }

    }
}
