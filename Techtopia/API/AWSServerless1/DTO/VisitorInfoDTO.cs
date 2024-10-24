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
    }
}
