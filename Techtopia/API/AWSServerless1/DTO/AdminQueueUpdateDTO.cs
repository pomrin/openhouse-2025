using AWSServerless1.DAL;

namespace AWSServerless1.DTO
{
    public class AdminQueueUpdateDTO
    {
        public String TicketId { get; set; }

        /// <summary>
        /// 0: Deleted
        /// 1: In Queue
        /// 2: Engraving
        /// 3: Pending Collection
        /// 4: Collected
        /// </summary>
        public QueueDAL.QUEUE_STATUS QUEUE_STATUS_TO_UPDATE { get; set; }
    }
}
