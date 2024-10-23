using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.ResponseObject
{
    public class LuggageTagColorsResObj
    {
        public string LuggageTagColorName { get; set; } = null!;

        public string? LuggageTagColorCode { get; set; }


        public static LuggageTagColorsResObj FromLuggageTagColorsEntities(LuggageTagColor ltc)
        {
            LuggageTagColorsResObj result = new LuggageTagColorsResObj()
            {
                LuggageTagColorCode = ltc.LuggageTagColorCode,
                LuggageTagColorName = ltc.LuggageTagColorName
            };
            return result;
        }
    }
}
