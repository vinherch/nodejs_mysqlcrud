#CREATE TABLE USER

use crud_nodejs;

CREATE TABLE IF NOT EXISTS USER (

id MEDIUMINT NOT NULL AUTO_INCREMENT,
photo VARCHAR(1024),
email VARCHAR(64) NOT NULL UNIQUE,
firstname VARCHAR(512) NOT NULL,
lastname VARCHAR(512) NOT NULL,
user_type ENUM('user','admin') DEFAULT 'user',
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
PRIMARY KEY (id)
);


#INSERTS
ALTER TABLE user AUTO_INCREMENT = 1;

INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Vincenz","Herzog", "herzogv88@gmail.com", "admin");
INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Hans","Meier", "meier@gmail.com", "user");
INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Fritz","Mueller", "mueller@gmail.com","user");
INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Peter","Kacker", "kacker@gmail.com", "user");
INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Paul","Scheisser", "scheisser@gmail.com", "user");
INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Uwe","Fucker", "fucker@gmail.com","user");
INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Marta","Bumser", "bumser@gmail.com", "user");
INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Klara","Arschgeweih", "arschgewei@gmail.com", "user");
INSERT INTO user (firstname,lastname,email,user_type) VALUES ("Adolf","Hummler", "hummler@gmail.com","user");


