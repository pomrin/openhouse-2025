using AWSServerless1.DAL;

namespace AWSServerless1.DTO
{
    public class AdminQueueUpdateDTO
    {
        public String TicketId { get; set; }

        public QueueDAL.QUEUE_STATUS QUEUE_STATUS_TO_UPDATE { get; set; }
    }
}
