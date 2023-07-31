import FriendRequestUtility from './FriendRequestUtility.js';
import GroupInviteUtility from './GroupInviteUlility.js';
import ReportUtility from './ReportUtility.js';
import LocationShareUtility from './LocationShareUtility.js';

class RequestUtilityFactory{
    createRequestUlilityByName(name){
        if (name === 'Friend request'){
            return new FriendRequestUtility();
        }
        else if (name=== 'Group invite'){
            return new GroupInviteUtility();
        }
        else if (name === 'Report'){
            return new ReportUtility();
        }
        else if (name === 'Location share'){
            return new LocationShareUtility();
        }
    }
}

export default new RequestUtilityFactory();