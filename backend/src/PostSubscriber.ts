import {
    EntitySubscriberInterface,
    EventSubscriber
} from "typeorm";
import {AfterQueryEvent} from "typeorm/subscriber/event/QueryEvent";
import {XUtils} from "@michalrakus/x-nest-server-lib/XUtils";
import {XEnvVar} from "@michalrakus/x-nest-server-lib/XEnvVars";

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface {

    /**
     * Called after query execution.
     */
    afterQuery(event: AfterQueryEvent<any>) {
        //console.log(`AFTER QUERY: `, event.query);
        if (XUtils.getEnvVarValueBoolean(XEnvVar.X_LOG_SQL)) {
            // ak logujeme SQL, tak zalogujeme aj cas (pri vyvoji logujeme, pri produkcii nie)
            console.log(`executionTime: `, event.executionTime);
        }
    }
}