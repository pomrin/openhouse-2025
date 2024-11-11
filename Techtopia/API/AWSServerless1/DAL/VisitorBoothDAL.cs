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
                                               orderby q.BoothId ascending
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

        public static VisitorBooth IssueOrUpdateVisitorBoothStamp(Visitor visitorEntity, Booth boothEntity)
        {
            VisitorBooth result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorBoothVisited = from q in context.VisitorBooths
                                               where q.VisitorId == visitorEntity.VisitorId
                                               && q.BoothId == boothEntity.BoothId
                                               select q;
                    if (qVisitorBoothVisited != null && qVisitorBoothVisited.Count() > 0)
                    {
                        // Already exist, update the status
                        result = qVisitorBoothVisited.First();
                    }
                    else
                    {
                        var newVisitorBoothRecord = new VisitorBooth()
                        {
                            BoothId = boothEntity.BoothId,
                            VisitorId = visitorEntity.VisitorId,
                        };
                        // Create a new status
                        context.VisitorBooths.Add(newVisitorBoothRecord);
                        context.SaveChanges();
                        result = newVisitorBoothRecord;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in UpdateVisitorBooth(visitorId: {visitorEntity.VisitorId}, boothId: {boothEntity.BoothId}) - {ex.Message}");
            }
            return result;
        }

        internal static VisitorBooth GetVisitorBoothByVisitorAndBooth(Visitor visitorEntity, Booth boothEntity)
        {
            VisitorBooth result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qVisitorBoothVisited = from q in context.VisitorBooths
                                               where q.VisitorId == visitorEntity.VisitorId
                                               && q.BoothId == boothEntity.BoothId
                                               select q;
                    if (qVisitorBoothVisited != null && qVisitorBoothVisited.Count() > 0)
                    {
                        // Already exist, update the status
                        result = qVisitorBoothVisited.First();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetVisitorBoothByVisitorAndBooth(visitorId: {visitorEntity.VisitorId}, boothId: {boothEntity.BoothId}) - {ex.Message}");
            }
            return result;
        }

        public static List<VisitorBooth>? GetVisitorBoothStatus(Visitor visitorEntity, bool includeNotVisited = false)
        {
            List<VisitorBooth> result = new List<VisitorBooth>();

            try
            {
                using (var context = new Openhouse25Context())
                {

                    var qVisitorBoothVisited = from q in context.VisitorBooths
                                               where q.VisitorId == visitorEntity.VisitorId
                                               orderby q.BoothId ascending
                                               select q;
                    if (qVisitorBoothVisited != null)
                    {
                        result.AddRange(qVisitorBoothVisited.ToList());
                        if (includeNotVisited)
                        {
                            var boothIdVisited = result.Select(x => x.BoothId).ToList();
                            var qBoothNotVisited = from q in context.Booths
                                                   where !boothIdVisited.Contains(q.BoothId)
                                                   orderby q.BoothId ascending
                                                   select new VisitorBooth()
                                                   {
                                                       BoothId = q.BoothId,
                                                       VisitorId = visitorEntity.VisitorId,
                                                       DateVisited = null
                                                   };
                            if (qBoothNotVisited != null && qBoothNotVisited.Count() > 0)
                            {
                                result.AddRange(qBoothNotVisited.ToList());
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = null;
                Console.WriteLine($"An Exception have occurred in GetVisitorBoothStatus(visitorId: {visitorEntity.VisitorId}) - {ex.Message}");
            }

            return result;
        }
    }
}
