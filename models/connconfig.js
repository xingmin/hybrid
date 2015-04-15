module.exports = {
	"oa":{
		user: 'liuxingmin@172.30.244.66',
		password: 'xflxmin17',
		server: '172.30.244.67', // You can use 'localhost\\instance' to connect to named instance
		database: 'iOffice',
		driver:'tds'
	},
	"hisbak":{
		user: 'liuxingmin@172.30.244.81',
		password: 'xflxmin17',
		server: '172.30.244.67', // You can use 'localhost\\instance' to connect to named instance
		database: 'chisdb_yszx',
		driver:'tds'
	},
	"queue":{
		user: 'sa',
		password: 'system',
		server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
		database: 'test',
//		driver:'tds'
	},
	"queueexternal":{
		user: 'sa',
		password: 'system',
		server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
		database: 'extsys',
//		driver:'tds'
	}
}