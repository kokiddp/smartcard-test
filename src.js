var pcsclite = require('@ap-mitch/pcsclite');

const pcsc = pcsclite();

pcsc.on('reader', (reader) => {

	console.log('New reader detected', reader.name);

	reader.on('error', err => {
		console.log('Error(', reader.name, '):', err.message);
	});

	reader.on('status', (status) => {

		console.log('Status(', reader.name, '): ' + status.state);

		// check what has changed
		const changes = reader.state ^ status.state;

		if (!changes) {
			return;
		}

		if (status.state == 18) {

			console.log("card removed");

			reader.disconnect(reader.SCARD_LEAVE_CARD, err => {

				if (err) {
					console.log(err);
					return;
				}

				console.log('Disconnected');

			});

			return;

		}

		if (status.state == 34) {

			console.log("card inserted");

			reader.connect({ share_mode: reader.SCARD_SHARE_SHARED }, (err, protocol) => {

				if (err) {
					console.log(err);
					return;
				}

				console.log('Protocol(', reader.name, '): ', protocol);

				reader.transmit(Buffer.from([0x00, 0xB0, 0x00, 0x00, 0x20]), 40, protocol, (err, data) => {

					if (err) {
						console.log(err);
						return;
					}

                    console.log('Data received', data);

				});

			});

			return;
		}

	});

	reader.on('end', () => {
		console.log('Reader ', reader.name, ' removed');
	});

});

pcsc.on('error', err => {
	console.log('PCSC error ', err.message);
});