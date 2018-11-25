DROP TABLE IF EXISTS Trait;
DROP TABLE IF EXISTS Profile;
DROP TABLE IF EXISTS User;

CREATE TABLE Profile(
	id INT UNIQUE NOT NULL AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
	word_Count INT NOT NULL,
	processed_Language VARCHAR(2) NOT NULL,
	id_User VARCHAR(45) NOT NULL,
	fecha DATETIME,
	completeJson TEXT,
	PRIMARY KEY (id)
);


CREATE TABLE Trait(
	trait_id VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL,
	percentile FLOAT NOT NULL,
	category VARCHAR(20) NOT NULL,
	profile_id INT NOT NULL,
	child_Of VARCHAR(50),
	FOREIGN KEY (profile_id) references Profile(id),
	FOREIGN KEY (child_Of) references Trait(trait_id),
	constraint PK_ALGO primary key (trait_id, profile_id)
);
CREATE TABLE User(
	usr VARCHAR(255) NOT NULL UNIQUE,
	pswd VARCHAR(255) NOT NULL,
    CONSTRAINT PK_Usr PRIMARY KEY (usr)
);
