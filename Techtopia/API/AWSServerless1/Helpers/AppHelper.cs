namespace AWSServerless1.Helpers
{
    public static class AppHelper
    {  // Global constants for Item Status
        public enum ITEM_STATUSES { LIVE = ITEM_STATUS_LIVE, DECOMMISSIONED = ITEM_STATUS_DECOMMISSIONED }
        public const int ITEM_STATUS_LIVE = 1;
        public const int ITEM_STATUS_DECOMMISSIONED = 2;

        // Global constants for Item Loanable
        public enum ITEM_LOANABLE_STATUSES { LOANABLE = ITEM_LOANABLE, NOT_LOANABLE = ITEM_NOT_LOANABLE }
        public const int ITEM_NOT_LOANABLE = 0;
        public const int ITEM_LOANABLE = 1;

        // Global constants for Item Loan Status
        public enum ITEM_LOAN_STATUSES { NOT_LOANED = ITEM_LOAN_STATUS_NOT_LOANED, RESERVED = ITEM_LOAN_STATUS_RESERVED, ASSIGNED = ITEM_LOAN_STATUS_ASSIGNED }
        public const int ITEM_LOAN_STATUS_NOT_LOANED = 0;
        public const int ITEM_LOAN_STATUS_RESERVED = 1;
        public const int ITEM_LOAN_STATUS_ASSIGNED = 2;

        // Global constants for Loan Request flow
        // flow: 0 -> 1 -> 2 -> 3 -> 4
        public enum LOAN_REQUEST_STATUSES
        {
            REJECTED_BY_ADDD = LOAN_REQUEST_STATUS_REJECTED_BY_ADDD
                , REJECTED_BY_TSOMGR = LOAN_REQUEST_STATUS_REJECTED_BY_TSOMGR
                , REJECTED_BY_TSO = LOAN_REQUEST_STATUS_REJECTED_BY_TSO
                , NEW_REQUEST = LOAN_REQUEST_STATUS_NEW_REQUEST
                , PENDING_APPROVAL_BY_TSOMGR = LOAN_REQUEST_STATUS_PENDING_APPROVAL_BY_TSOMGR
                , APPROVED_BY_TSOMGR = LOAN_REQUEST_STATUS_APPROVED_BY_TSOMGR
                , APPROVED_BY_TSOMGR_AND_PENDING_APPROVAL_BY_ADDD = LOAN_REQUEST_STATUS_APPROVED_BY_TSOMGR_AND_PENDING_APPROVAL_BY_ADDD
                , APPROVED_BY_ADDD = LOAN_REQUEST_STATUS_APPROVED_BY_ADDD
        }
        public const int LOAN_REQUEST_STATUS_REJECTED_BY_ADDD = -3;
        public const int LOAN_REQUEST_STATUS_REJECTED_BY_TSOMGR = -2;
        public const int LOAN_REQUEST_STATUS_REJECTED_BY_TSO = -1;
        public const int LOAN_REQUEST_STATUS_NEW_REQUEST = 0;
        public const int LOAN_REQUEST_STATUS_PENDING_APPROVAL_BY_TSOMGR = 1;
        public const int LOAN_REQUEST_STATUS_APPROVED_BY_TSOMGR = 2;
        public const int LOAN_REQUEST_STATUS_APPROVED_BY_TSOMGR_AND_PENDING_APPROVAL_BY_ADDD = 3;
        public const int LOAN_REQUEST_STATUS_APPROVED_BY_ADDD = 4;


        public static String ConvertLoanRequestStatusesToString(int loanRequestAssetStatus)
        {
            LOAN_REQUEST_STATUSES loanRequestStatus = (LOAN_REQUEST_STATUSES)Enum.ToObject(typeof(LOAN_REQUEST_STATUSES), loanRequestAssetStatus);
            return ConvertLoanRequestStatusesToString(loanRequestStatus);
        }

        public static String ConvertLoanRequestStatusesToString(LOAN_REQUEST_STATUSES loanRequestStatus)
        {
            String result = "";
            switch (loanRequestStatus)
            {
                case LOAN_REQUEST_STATUSES.REJECTED_BY_ADDD:
                    result = "Rejected by AD/DD";
                    break;
                case LOAN_REQUEST_STATUSES.REJECTED_BY_TSOMGR:
                    result = "Rejected by TSO Manager";
                    break;
                case LOAN_REQUEST_STATUSES.REJECTED_BY_TSO:
                    result = "Rejected by TE";
                    break;
                case LOAN_REQUEST_STATUSES.NEW_REQUEST:
                    result = "New Request";
                    break;
                case LOAN_REQUEST_STATUSES.PENDING_APPROVAL_BY_TSOMGR:
                    result = "Pending Approval by TSO Manager";
                    break;
                case LOAN_REQUEST_STATUSES.APPROVED_BY_TSOMGR:
                    result = "Approved by TSO Manager";
                    break;
                case LOAN_REQUEST_STATUSES.APPROVED_BY_TSOMGR_AND_PENDING_APPROVAL_BY_ADDD:
                    result = "Approved by TSO Manager and Pending Approval by AD/DD";
                    break;
                case LOAN_REQUEST_STATUSES.APPROVED_BY_ADDD:
                    result = "Approved by AD/DD";
                    break;
                default:
                    break;
            }
            return result;
        }



        // Global constants for Loan Request Approval Status
        public enum LOAN_REQUEST_APPROVAL_STATUSES { NEW = LOAN_REQUEST_APPROVAL_STATUS_NEW, PENDING = LOAN_REQUEST_APPROVAL_STATUS_PENDING, APPROVED = LOAN_REQUEST_APPROVAL_STATUS_APPROVED, REJECTED = LOAN_REQUEST_APPROVAL_STATUS_REJECTED }
        public const int LOAN_REQUEST_APPROVAL_STATUS_REJECTED = -1;
        public const int LOAN_REQUEST_APPROVAL_STATUS_NEW = 0;
        public const int LOAN_REQUEST_APPROVAL_STATUS_PENDING = 1;
        public const int LOAN_REQUEST_APPROVAL_STATUS_APPROVED = 2;




        public static String ConvertLoanRequestApprovalStatusesToString(int loanRequestApprovalStatus)
        {
            var enumLoanRequestStatus = (LOAN_REQUEST_APPROVAL_STATUSES)Enum.ToObject(typeof(LOAN_REQUEST_APPROVAL_STATUSES), loanRequestApprovalStatus);
            return ConvertLoanRequestApprovalStatusesToString(enumLoanRequestStatus);
        }

        public static String ConvertLoanRequestApprovalStatusesToString(LOAN_REQUEST_APPROVAL_STATUSES loanRequestApprovalStatus)
        {
            String result = "";
            result = loanRequestApprovalStatus.ToString();
            return result;
        }



        // Global constants for Loan history transaction type
        public const int ITEM_LOAN_HISTORY_TRANSACTION_TYPE_ASSIGN_ITEM = 1;
        public const int ITEM_LOAN_HISTORY_TRANSACTION_TYPE_RETURN_ITEM = 2;

        // Global constants for Loan Extension Request APPROVAL status
        public const int LOAN_EXT_REQUEST_APPROVAL_STATUS_NEW = 0;
        public const int LOAN_EXT_REQUEST_APPROVAL_STATUS_PENDING = 1;
        public const int LOAN_EXT_REQUEST_APPROVAL_STATUS_APPROVED = 2;
        public const int LOAN_EXT_REQUEST_APPROVAL_STATUS_REJECTED = -1;

        // Global constants for Loan Request Asset Status
        public enum LOAN_REQUEST_ASSET_STATUSES { RESERVED = LOAN_REQUEST_ASSET_STATUS_RESERVED, LOANED_OUT = LOAN_REQUEST_ASSET_STATUS_LOANED_OUT, RETURNED = LOAN_REQUEST_ASSET_STATUS_RETURNED, CANCELLED = LOAN_REQUEST_ASSET_STATUS_CANCELLED }
        public const int LOAN_REQUEST_ASSET_STATUS_RESERVED = 1;
        public const int LOAN_REQUEST_ASSET_STATUS_LOANED_OUT = 2;
        public const int LOAN_REQUEST_ASSET_STATUS_RETURNED = 3;
        public const int LOAN_REQUEST_ASSET_STATUS_CANCELLED = 4;

        public static String ConvertLoanrequestAssetStatusesToString(int loanRequestAssetStatus)
        {
            LOAN_REQUEST_ASSET_STATUSES assetStatus = (LOAN_REQUEST_ASSET_STATUSES)Enum.ToObject(typeof(LOAN_REQUEST_ASSET_STATUSES), loanRequestAssetStatus);
            return ConvertLoanrequestAssetStatusesToString(assetStatus);
        }

        public static String ConvertLoanrequestAssetStatusesToString(LOAN_REQUEST_ASSET_STATUSES loanRequestAssetStatus)
        {
            String result = "";
            switch (loanRequestAssetStatus)
            {
                case LOAN_REQUEST_ASSET_STATUSES.RESERVED:
                    result = "Reserved";
                    break;
                case LOAN_REQUEST_ASSET_STATUSES.LOANED_OUT:
                    result = "Loaned Out";
                    break;
                case LOAN_REQUEST_ASSET_STATUSES.RETURNED:
                    result = "Returned";
                    break;
                case LOAN_REQUEST_ASSET_STATUSES.CANCELLED:
                    result = "Cancelled";
                    break;
                default:
                    result = "Unsupported";
                    break;
            }
            return result;
        }

        // Global constants for Loan EXTENSION Request flow
        // flow: 0 -> 1 -> 2 -> 3 -> 4
        public const int LOAN_EXT_REQUEST_STATUS_REJECTED_BY_ADDD = -3;
        public const int LOAN_EXT_REQUEST_STATUS_REJECTED_BY_TSOMGR = -2;
        public const int LOAN_EXT_REQUEST_STATUS_REJECTED_BY_TSO = -1;
        public const int LOAN_EXT_REQUEST_STATUS_NEW_REQUEST = 0;
        public const int LOAN_EXT_REQUEST_STATUS_PENDING_APPROVAL_BY_TSOMGR = 1;
        public const int LOAN_EXT_REQUEST_STATUS_APPROVED_BY_TSOMGR = 2;
        public const int LOAN_EXT_REQUEST_STATUS_APPROVED_BY_TSOMGR_AND_PENDING_APPROVAL_BY_ADDD = 3;
        public const int LOAN_EXT_REQUEST_STATUS_APPROVED_BY_ADDD = 4;
    }
}
