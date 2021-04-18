package ru.saray.jm.restfetchtask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.saray.jm.restfetchtask.model.Role;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}