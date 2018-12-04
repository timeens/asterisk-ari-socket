export class AriWeboscketEventModel {
    constructor(eventString) {
        this.relevantEvents = ['StasisStart', 'StasisEnd', 'ChannelDestroyed', 'Dial'];
        this.dataInterface = JSON.parse(eventString);
    }
    get channel() {
        return this.dataInterface.peer || this.dataInterface.channel || null;
    }
    get type() {
        return this.dataInterface.type;
    }
    get callingNumber() {
        return this.dataInterface.channel.caller.number || null;
    }
    get hangupCause() {
        return this.dataInterface.cause_txt || null;
    }
    isRelevant() {
        return this.relevantEvents.filter((str) => {
            return str === this.type;
        }).length === 1;
    }
}
