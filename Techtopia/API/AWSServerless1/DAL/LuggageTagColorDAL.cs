using ProjectEFEntities.OH25EntityModels;
using System.ComponentModel;

namespace AWSServerless1.DAL
{
    public static class LuggageTagColorDAL
    {

        public static List<LuggageTagColor> GetAllTagColors()
        {
            List<LuggageTagColor> result = new List<LuggageTagColor>();

            try
            {
                using (var context = new Openhouse25Context())
                {
                    result = context.LuggageTagColors.ToList();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetAllTagColors() - {ex.Message}");
            }

            return result;
        }

        internal static LuggageTagColor GetLuggageTagColorByName(string luggageTagColor)
        {
            LuggageTagColor result = null;
            try
            {
                if (!String.IsNullOrEmpty(luggageTagColor))
                {
                    luggageTagColor = luggageTagColor.Trim().ToUpper();
                }
                using (var context = new Openhouse25Context())
                {
                    var qColorCheck = from q in context.LuggageTagColors
                                      where q.LuggageTagColorName.Trim().ToUpper() == luggageTagColor
                                      select q;
                    if (qColorCheck != null && qColorCheck.Any())
                    {
                        result = qColorCheck.First();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in GetAllTagColors(luggageTagColor: {luggageTagColor}) - {ex.Message}");
            }
            return result;
        }
    }
}
