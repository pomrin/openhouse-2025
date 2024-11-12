using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.DAL
{
    public static class WorkshopDAL
    {
        public static List<Workshop> GetAllWorkshops()
        {
            var result = new List<Workshop>();

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qBooth = from q in context.Workshops
                                 select q;
                    if (qBooth != null)
                    {
                        result.AddRange(qBooth.ToList());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetAllWorkshops() - {ex.Message}");
            }

            return result;
        }

        public static Workshop GetWorkshopByWorkshopId(int workshopId)
        {
            Workshop result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qBooth = from q in context.Workshops
                                 where q.WorkshopId == workshopId
                                 select q;
                    if (qBooth != null)
                    {
                        result = qBooth.First();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetWorkshopByWorkshopId(workshopId: {workshopId}) - {ex.Message}");
            }

            return result;
        }
    }
}
