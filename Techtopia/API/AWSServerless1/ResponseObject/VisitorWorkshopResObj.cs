using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.ResponseObject
{
    public class VisitorWorkshopResObj
    {
        public int VisitorId { get; set; }

        public int WorkshopId { get; set; }

        public DateTime? DateCompleted { get; set; }

        public DateTime? DateCertificateSent { get; set; }


        public static VisitorWorkshopResObj FromVisitorWorkShopEntity(VisitorWorkshop visitorWorkshopEntity)
        {
            VisitorWorkshopResObj result = new VisitorWorkshopResObj()
            {
                VisitorId = visitorWorkshopEntity.VisitorId,
                WorkshopId = visitorWorkshopEntity.WorkshopId,
                DateCertificateSent = visitorWorkshopEntity.DateCertificateSent,
                DateCompleted = visitorWorkshopEntity.DateCompleted,
            };

            return result;
        }
    }
}
