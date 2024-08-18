window.serialHelper = {
    serialPort: null,
    reader: null,
    writer: null,

    getPorts: async function () {
        console.log("Scanning for COM Ports");
        if (!("serial" in navigator)) {
            console.error("Web Serial API not supported.");
            return [];
        }
        return await navigator.serial.getPorts();
        //return ports.map(port => port.getInfo().usbProductId);
    },

    connect: async function (baudRate) {
        if ("serial" in navigator) {
            try {
                const port = await navigator.serial.requestPort();
                await port.open({ baudRate: baudRate });
                window.serialHelper.serialPort = port;
                window.serialHelper.reader = port.readable.getReader();
                window.serialHelper.writer = port.writable.getWriter();
                return true;
            } catch (err) {
                console.error("Error connecting to serial port: ", err);
                return false;
            }
        } else {
            console.error("Web Serial API not supported.");
            return false;
        }
    },

    disconnect: async function () {
        if (window.serialHelper.serialPort) {
            await window.serialHelper.reader.releaseLock();
            await window.serialHelper.writer.releaseLock();
            await window.serialHelper.serialPort.close();
            window.serialHelper.serialPort = null;
            window.serialHelper.reader = null;
            window.serialHelper.writer = null;
        }
    },

    read: async function () {
        if (window.serialHelper.reader) {
            try {
                const { value, done } = await window.serialHelper.reader.read();
                return new TextDecoder().decode(value);
            } catch (err) {
                console.error("Error reading from serial port: ", err);
                return null;
            }
        }
        return null;
    },

    write: async function (data) {
        if (window.serialHelper.writer) {
            try {
                await window.serialHelper.writer.write(new TextEncoder().encode(data));
            } catch (err) {
                console.error("Error writing to serial port: ", err);
            }
        }
    }
};
