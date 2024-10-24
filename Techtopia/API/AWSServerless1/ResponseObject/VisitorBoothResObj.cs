using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.ResponseObject
{
    public class VisitorBoothResObj
    {
        private int visitorId;
        private int boothId;
        private DateTime? dateVisited;

        public int VisitorId
        {
            get
            {
                return this.visitorId;
            }

            set
            {
                this.visitorId = value;
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

        public DateTime? DateVisited
        {
            get
            {
                return this.dateVisited;
            }

            set
            {
                this.dateVisited = value;
            }
        }

        public static VisitorBoothResObj FromVisitorBoothEntity(VisitorBooth visitorBoothEntity)
        {
            VisitorBoothResObj result = new VisitorBoothResObj()
            {
                boothId = visitorBoothEntity.BoothId,
                visitorId = visitorBoothEntity.VisitorId,
                dateVisited = visitorBoothEntity.DateVisited,
            };
            return result;
        }
    }
}
