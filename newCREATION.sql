DROP TABLE IF EXISTS Trait;
DROP TABLE IF EXISTS Profile;
DROP TABLE IF EXISTS User;

/*Ahorita la base de datos esta para que un user(email) pueda tener varios profiles, y cada profile
tiene asociado una info de la persona del profile (la persona de la cuenta de twitter o que escribio el ensayo),
No necesariamente es la informacion del usuario, un usuario puede obtener el perfil de un ensayo que no sea suyo
y poner la informacion de la persona que escribio el ensayo
Estaria bien que el usuario diera un nombre al profile (ej. Reporte de Ensayo Escritura Creativa), para que luego
pueda encontrar facilmente. Para eso estaria bien que (id_user, profileName) sean unique y sean la llave primaria
pero no se puede hacer eso ahorita porque habria nulos en profileName, tendriamos que borrar la informacion.
Ahorita tiene profileName pero este se puede repetir por usuario
*/
CREATE TABLE Profile(
	id INT UNIQUE NOT NULL AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
	profileName VARCHAR(50),
	word_Count INT NOT NULL,
	processed_Language VARCHAR(2) NOT NULL,
	id_User VARCHAR(45) NOT NULL,
	fecha DATETIME,
	completeJson TEXT,
	id_author INT,
	PRIMARY KEY (id)
	FOREIGN KEY (id_author) references InfoAuthor (id_author)
);

/*
ALTER TABLE Profile
ADD id_author INT,
ADD profileName VARCHAR(50),
ADD CONSTRAINT FK_Profile FOREIGN KEY (id_author) REFERENCES InfoAuthor(id_author); */

CREATE TABLE InfoAuthor(
	id_author INT UNIQUE NOT NULL AUTO_INCREMENT,
	gender VARCHAR(20),
	PRIMARY KEY (id_author)
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
