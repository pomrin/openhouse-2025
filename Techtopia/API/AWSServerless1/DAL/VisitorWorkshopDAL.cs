using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.DAL
{
    public static class VisitorWorkshopDAL
    {

        public static List<VisitorWorkshop> GetVisitorWorkshopCompleted(int visitorId)
        {
            var result = new List<VisitorWorkshop>();

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorWorkshops = from q in context.VisitorWorkshops
                                            where q.VisitorId == visitorId
                                            orderby q.WorkshopId ascending
                                            select q;
                    if (qVisitorWorkshops != null)
                    {
                        result.AddRange(qVisitorWorkshops.ToList());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetVisitorWorkshopCompleted(visitorId: {visitorId}) - {ex.Message}");
            }

            return result;
        }

        internal static VisitorWorkshop IssueOrUpdateVisitorWorkshopCompletionStatus(Visitor visitorEntity, Workshop workshopEntity)
        {
            VisitorWorkshop result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorBoothVisited = from q in context.VisitorWorkshops
                                               where q.VisitorId == visitorEntity.VisitorId
                                               && q.WorkshopId == workshopEntity.WorkshopId
                                               select q;
                    if (qVisitorBoothVisited != null && qVisitorBoothVisited.Count() > 0)
                    {
                        // Already exist, update the status
                        result = qVisitorBoothVisited.First();
                    }
                    else
                    {
                        var newVisitorBoothRecord = new VisitorWorkshop()
                        {
                            WorkshopId = workshopEntity.WorkshopId,
                            VisitorId = visitorEntity.VisitorId,
                        };
                        // Create a new status
                        context.VisitorWorkshops.Add(newVisitorBoothRecord);
                        context.SaveChanges();
                        result = newVisitorBoothRecord;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in IssueOrUpdateVisitorWorkshopCompleted(visitorId: {visitorEntity.VisitorId}, workshopEntity: {workshopEntity.WorkshopId}) - {ex.Message}");
            }
            return result;
        }


        public static List<VisitorWorkshop>? GetVisitorWorkshopCompletionStatus(int visitorId, bool includeNotVisited = false)
        {
            var result = new List<VisitorWorkshop>();

            try
            {
                using (var context = new Openhouse25Context())
                {

                    var qVisitorBoothVisited = from q in context.VisitorWorkshops
                                               where q.VisitorId == visitorId
                                               orderby q.WorkshopId ascending
                                               select q;
                    if (qVisitorBoothVisited != null)
                    {
                        result.AddRange(qVisitorBoothVisited.ToList());
                        if (includeNotVisited)
                        {
                            var workshopIdVisited = result.Select(x => x.WorkshopId).ToList();
                            var qWorkshopNotVisited = from q in context.Workshops
                                                      where !workshopIdVisited.Contains(q.WorkshopId)
                                                      orderby q.WorkshopId ascending
                                                      select new VisitorWorkshop()
                                                      {
                                                          WorkshopId = q.WorkshopId,
                                                          VisitorId = visitorId,
                                                          DateCompleted = null
                                                      };
                            if (qWorkshopNotVisited != null && qWorkshopNotVisited.Count() > 0)
                            {
                                result.AddRange(qWorkshopNotVisited.ToList());
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = null;
                Console.WriteLine($"An Exception have occurred in GetVisitorWorkshopCompletionStatus(visitorId: {visitorId}) - {ex.Message}");
            }

            return result;
        }
    }
}
