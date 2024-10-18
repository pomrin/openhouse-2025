using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.DAL
{
    public static class VisitorBoothDAL
    {

        public static List<VisitorBooth> GetVisitorBoothVisited(int visitorId)
        {
            List<VisitorBooth> result = new List<VisitorBooth>();

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorBoothVisited = from q in context.VisitorBooths
                                               where q.VisitorId == visitorId
                                               select q;
                    if (qVisitorBoothVisited != null)
                    {
                        result.AddRange(qVisitorBoothVisited.ToList());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetVisitorBoothVisited(visitorId: {visitorId}) - {ex.Message}");
            }

            return result;
        }


    }
}
