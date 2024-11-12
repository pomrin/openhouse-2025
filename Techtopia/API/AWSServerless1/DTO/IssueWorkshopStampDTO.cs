namespace AWSServerless1.DTO
{
    public class IssueWorkshopStampDTO
    {
        private String ticketId;
        private int workshopId;

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

        public int WorkshopId
        {
            get
            {
                return this.workshopId;
            }

            set
            {
                this.workshopId = value;
            }
        }
    }
}
