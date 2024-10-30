using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.DTO
{
    public class VisitorInfoDTO
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

        public DateTime? DateCertificateSent { get; set; }


        public static VisitorInfoDTO FromVisitorEntity(Visitor visitorEntity)
        {
            var result = new VisitorInfoDTO()
            {
                DateCertificateSent = visitorEntity.DateCertificateSent,
                Datecreated = visitorEntity.Datecreated,
                LuggageRedeemedDate = visitorEntity.LuggageRedeemedDate,
                LuggageTagColorName = visitorEntity.LuggageTagColorName,
                ProfileImageUrl = visitorEntity.ProfileImageUrl,
                TicketId = visitorEntity.TicketId,
                VisitorId = visitorEntity.VisitorId
            };
            return result;
        }
    }
}
