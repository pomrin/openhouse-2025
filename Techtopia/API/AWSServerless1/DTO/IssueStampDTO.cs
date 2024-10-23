namespace AWSServerless1.DTO
{
    public class IssueStampDTO
    {
        private String ticketId;
        private int boothId;

        public string TicketId
        {
            get
            {
                return this.ticketId;
            }

            set
            {
                this.ticketId = value;
            }
        }

        public int BoothId
        {
            get
            {
                return this.boothId;
            }

            set
            {
                this.boothId = value;
            }
        }
    }
}
