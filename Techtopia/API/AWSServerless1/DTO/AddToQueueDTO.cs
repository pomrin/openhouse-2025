namespace AWSServerless1.DTO
{
    public class AddToQueueDTO
    {
        public String TicketId { get; set; }

        public string LuggageTagColor { get; set; } = null!;

        public string EngravingText { get; set; } = null!;
    }
}
