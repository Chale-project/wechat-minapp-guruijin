import store from '@/store'
import util from "@/common/utils";


class Print {
    constructor() {
        // #ifndef H5

        // #endif

        // #ifdef H5
        // #endif

        this.looptime = 0
        this.currentTime = 1
        this.lastData = 0
        this.oneTimeData = 200 // 每次发送数据大小 

        this.printerNum = 1 // 打印份数

        this.currentPrint = 1 // 当前打印第几份


    }

    /**
     * @param {number} num
     */
    set setPrinterNum(num) {
        this.printerNum = num
    }

    prepareSend(buff) {
        // console.log(buff)
        let time = this.oneTimeData
        let looptime = parseInt(buff.length / time);
        let lastData = parseInt(buff.length % time);
        // console.log(looptime + "---" + lastData)
        ++looptime

        this.looptime = looptime
        this.lastData = lastData
        this.currentTime = 1
        this.send(buff)
    }

    send(buff) {
        var currentTime = this.currentTime
        var loopTime = this.looptime
        var lastData = this.lastData
        var onTimeData = this.oneTimeData
        var printNum = this.printerNum
        var currentPrint = this.currentPrint
        var buf
        var dataView
        if (currentTime < loopTime) {
            buf = new ArrayBuffer(onTimeData)
            dataView = new DataView(buf)
            for (var i = 0; i < onTimeData; ++i) {
                dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
            }
        } else {
            buf = new ArrayBuffer(lastData)
            dataView = new DataView(buf)
            for (var i = 0; i < lastData; ++i) {
                dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
            }
        }
        console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
        util.showLoading('打印中…');

        uni.writeBLECharacteristicValue({
            deviceId: store.getters.BLEInformation.deviceId,
            serviceId: store.getters.BLEInformation.writeServiceId,
            characteristicId: store.getters.BLEInformation.writeCharaterId,
            value: buf,
            success: (res) => {
                console.log(res)
            },
            fail: (e) => {
                console.log(e)
            },
            complete: () => {
                currentTime++
                if (currentTime <= loopTime) {
                    this.currentTime = currentTime
                    this.send(buff)
                } else {
                    util.showToastError('已打印第' + currentPrint + '张');
                    if (currentPrint == printNum) {
                        this.looptime = 0
                        this.lastData = 0
                        this.currentTime = 1
                        this.currentPrint = 1
                        util.hideLoading();
                    } else {
                        currentPrint++
                        this.currentPrint = currentPrint
                        this.currentTime = 1
                        this.send(buff)
                    }
                }
            }
        })

    }
}


export default Print