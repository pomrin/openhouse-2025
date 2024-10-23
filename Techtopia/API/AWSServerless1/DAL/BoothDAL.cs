using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.DAL
{
    public static class BoothDAL
    {

        public static List<Booth> GetAllBooths()
        {
            List<Booth> result = new List<Booth>();

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qBooth = from q in context.Booths
                                 select q;
                    if (qBooth != null)
                    {
                        result.AddRange(qBooth.ToList());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetAllBooths() - {ex.Message}");
            }

            return result;
        }

        public static Booth GetBoothByBoothId(int boothId)
        {
            Booth result = null;

            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qBooth = from q in context.Booths
                                 where q.BoothId == boothId
                                 select q;
                    if (qBooth != null)
                    {
                        result = qBooth.First();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetBoothByBoothId(boothId: {boothId}) - {ex.Message}");
            }

            return result;
        }
    }
}
