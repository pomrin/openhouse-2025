const addZeros = (Id) => { return String(Id).padStart(6, '0'); };

const statusChecker = (Integer) => { 
    switch (Integer) {
        case -3: return "Rejected by AD/DD";
        case -2: return "Rejected by TSO Mgr";
        case -1: return "Rejected by TSO"
        case 0: return "Pending approval"
        case 1: return "Approved by TSO"
        case 2: return "Approved by TSO Mgr"
        case 3: return "Approved by TSO MGR and Pending Approval by AD or DD"
        case 4: return "Approved by AD/DD"
    }
}

const global = {
    datetimeFormat: 'YYYY-MM-DD HH:mm',
    dateFormat: 'YYYY-MM-DD',
    addZeros: addZeros,
    statusChecker: statusChecker,
}

export default global;