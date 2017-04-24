<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

// Make sure composer dependencies have been installed
require __DIR__ . '/vendor/autoload.php';

class Chat implements MessageComponentInterface {
	protected $clients;

	public function __construct() {
		$this->clients = new \SplObjectStorage;
	}

	public function onOpen(ConnectionInterface $conn) {
		$this->clients->attach($conn);
	}

	public function onMessage(ConnectionInterface $from, $msg) {
		foreach ($this->clients as $client) {
			if ($from != $client) {
				$client->send($msg);
			}
		}
	}

	public function onClose(ConnectionInterface $conn) {
		$this->clients->detach($conn);
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		$conn->close();
	}
}

$app = new Ratchet\App('localhost', 8080);
$app->route('/chat', new Chat);
$app->route('/echo', new Ratchet\Server\EchoServer, array('*'));
$app->run();