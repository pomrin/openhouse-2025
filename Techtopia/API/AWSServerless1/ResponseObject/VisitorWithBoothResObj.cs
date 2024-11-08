using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.ResponseObject
{
    public class VisitorWithBoothResObj
    {
        public int VisitorId { get; set; }

        public DateTime Datecreated { get; set; }

        /// <summary>
        /// ARGB
        /// </summary>
        public string? LuggageTagColorName { get; set; }

        /// <summary>
        /// In the format of &lt;DDD&gt;&lt;visitor_id&gt;&lt;random_3_alphabets&gt;
        /// </summary>
        public string? TicketId { get; set; }

        public DateTime? LuggageRedeemedDate { get; set; }

        public string? ProfileImageUrl { get; set; }

        public virtual List<VisitorBoothResObj> VisitorBooths { get; set; } = new List<VisitorBoothResObj>();



        public static VisitorWithBoothResObj FromVisitorEntity(Visitor visitorEntityWithBooth)
        {
            var result = new VisitorWithBoothResObj()
            {
                TicketId = visitorEntityWithBooth.TicketId,
                Datecreated = visitorEntityWithBooth.Datecreated,
                LuggageRedeemedDate = visitorEntityWithBooth.LuggageRedeemedDate,
                LuggageTagColorName = visitorEntityWithBooth?.LuggageTagColorName,
                ProfileImageUrl = visitorEntityWithBooth?.ProfileImageUrl,
                VisitorId = visitorEntityWithBooth.VisitorId,
            };
            var qVisitorBooth = from q in visitorEntityWithBooth.VisitorBooths
                                select VisitorBoothResObj.FromVisitorBoothEntity(q);
            if (qVisitorBooth != null && qVisitorBooth.Count() > 0)
            {
                result.VisitorBooths.AddRange(qVisitorBooth.ToList());
            }

            return result;
        }

    }
}
