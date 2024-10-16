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

    }
}
