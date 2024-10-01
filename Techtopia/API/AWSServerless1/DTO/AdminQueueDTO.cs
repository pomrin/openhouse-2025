using Microsoft.EntityFrameworkCore.Query;
using ProjectEFEntities.OH25EntityModels;
using System.Collections.ObjectModel;

namespace AWSServerless1.DTO
{
    public class AdminQueueDTO
    {
        private List<QueueDTO> queue;
        private List<QueueDTO> queueEngraving;
        private List<QueueDTO> queuePendingCollection;
        private List<QueueDTO> queueCollected;

        public List<QueueDTO> Queue
        {
            get
            {
                return this.queue;
            }

            set
            {
                this.queue = value;
            }
        }

        public List<QueueDTO> QueueEngraving
        {
            get
            {
                return this.queueEngraving;
            }

            set
            {
                this.queueEngraving = value;
            }
        }

        public List<QueueDTO> QueuePendingCollection
        {
            get
            {
                return this.queuePendingCollection;
            }

            set
            {
                this.queuePendingCollection = value;
            }
        }

        public List<QueueDTO> QueueCollected
        {
            get
            {
                return this.queueCollected;
            }

            set
            {
                this.queueCollected = value;
            }
        }
    }


    public class QueueDTO
    {
        private String ticketId;
        private DateTime? dateJoined;
        private DateTime? dateEngraving;
        private DateTime? datePendingCollection;
        private DateTime? dateCollected;
        private String textToEngrave;
        private String tagColor;

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

        public DateTime? DateJoined
        {
            get
            {
                return this.dateJoined;
            }

            set
            {
                this.dateJoined = value;
            }
        }

        public DateTime? DateEngraving
        {
            get
            {
                return this.dateEngraving;
            }

            set
            {
                this.dateEngraving = value;
            }
        }

        public DateTime? DatePendingCollection
        {
            get
            {
                return this.datePendingCollection;
            }

            set
            {
                this.datePendingCollection = value;
            }
        }

        public DateTime? DateCollected
        {
            get
            {
                return this.dateCollected;
            }

            set
            {
                this.dateCollected = value;
            }
        }

        public string TextToEngrave
        {
            get
            {
                return this.textToEngrave;
            }

            set
            {
                this.textToEngrave = value;
            }
        }

        public string TagColor
        {
            get
            {
                return this.tagColor;
            }

            set
            {
                this.tagColor = value;
            }
        }


        public static QueueDTO FromQueueEntity(RedemptionQueue redemptionQueueEntity)
        {
            QueueDTO result = new QueueDTO()
            {
                dateJoined = redemptionQueueEntity.DateJoined,
                DateEngraving = redemptionQueueEntity.DateEngravingStart,
                datePendingCollection = redemptionQueueEntity.DatePendingCollection,
                dateCollected = redemptionQueueEntity.DateCollected,
                textToEngrave = redemptionQueueEntity.EngravingText,
                tagColor = redemptionQueueEntity.LuggageTagColor,
                ticketId = redemptionQueueEntity.Visitor.TicketId
            };


            return result;
        }
    }
}
