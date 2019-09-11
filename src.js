var pcsclite = require('@ap-mitch/pcsclite');

const pcsc = pcsclite();

pcsc.on('reader', function(reader) {

    function exit() {
        reader.close();
        pcsc.close();
    }

	SELECT_MF = Buffer.from([0x00, 0xA4, 0x00, 0x00, 0x02, 0x3F, 0x00]);
	SELECT_DF1 = Buffer.from([0x00, 0xA4, 0x00, 0x00, 0x02, 0x11, 0x00]);
	SELECT_EF_PERS = Buffer.from([0x00, 0xA4, 0x00, 0x00, 0x02, 0x11, 0x02]);
	READ_BIN = Buffer.from([0x00, 0xB0, 0x00, 0x00, 0x00]);

    console.log('Reader: ', reader.name);

    reader.connect({ share_mode: reader.SCARD_SHARE_SHARED }, function(err, protocol) {
        if (err) {
            console.log(err);
            return exit();
        }
        reader.transmit(SELECT_MF, 255, protocol, function(err, data) {
            if (err) {
                console.log(err);
                return exit();
			}
            reader.transmit(SELECT_DF1, 255, protocol, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
					reader.transmit(SELECT_EF_PERS, 255, protocol, function(err, data) {
						if (err) {
							console.log(err);
						} else {
							reader.transmit(READ_BIN, 255, protocol, function(err, data) {
								if (err) {
									console.log(err);
								} else {
									console.log('Personal Info: ', data.toString());
								}
								return exit();
							});
						}
					});
                }
            });
        });
    });
});

pcsc.on('error', function(err) {
    console.log('PCSC error', err.message);
});