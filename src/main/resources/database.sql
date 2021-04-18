-- Table: users
create table users
(
    id       bigint       not null auto_increment primary key,
    username varchar(255) not null unique,
    nickname varchar(255) not null,
    email    varchar(255) not null,
    password varchar(255) not null
)
    ENGINE = InnoDB;

-- Table: roles
create table roles
(
    id   bigint       not null auto_increment primary key,
    role varchar(100) not null
)
    ENGINE = InnoDB;

-- Table for mapping user and roles: user_roles
create table user_roles
(
    user_id bigint not null,
    role_id bigint not null,
    foreign key (user_id) references users (id),
    foreign key (role_id) references roles (id)
)
    ENGINE = InnoDB;

-- Insert data
insert into users values (1, 'ADMIN', 'BIGBOSS', 'admin@mail.ru', 'ADMIN');
insert into users values (2, 'USER', 'LITTLEBOSS', 'user@gmail.com', 'USER');
insert into users values (3, 'Rimma', 'CyberRi', 'ri@mail.ru', '123456');
insert into users values (4, 'Batman', 'CatWomanLover', 'bruce@mail.ru', '654321');
insert into users values (5, 'Logan', 'Wolverine', 'xman@mail.ru', '159753');

insert into roles values (1, 'ROLE_USER');
insert into roles values (2, 'ROLE_ADMIN');

insert into user_roles values (1, 2);
insert into user_roles values (1, 1);
insert into user_roles values (2, 1);
insert into user_roles values (3, 1);
insert into user_roles values (4, 1);
insert into user_roles values (5, 1);