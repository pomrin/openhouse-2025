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

    }
}
