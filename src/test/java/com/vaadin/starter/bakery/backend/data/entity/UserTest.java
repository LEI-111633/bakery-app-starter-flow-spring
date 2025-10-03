package com.vaadin.starter.bakery.backend.data.entity;

import org.junit.Assert;
import org.junit.Test;

public class UserTest {

	@Test
   public void equalsTest() {
        // Cria o primeiro objeto User e define seus atributos
        User o1 = new User();
        o1.setPasswordHash("hash");
        o1.setEmail("abc@vaadin.com");
        o1.setFirstName("first");
        o1.setLastName("last");
        o1.setRole("role");

        // Cria o segundo objeto User com alguns atributos diferentes
        User o2 = new User();
        o2.setPasswordHash("anotherhash"); // diferente de o1
        o2.setEmail("abc@vaadin.com");     // igual a o1
        o2.setFirstName("anotherName");    // diferente de o1
        o2.setLastName("last");            // igual a o1
        o2.setRole("role");                // igual a o1

        // Verifica se os dois objetos são diferentes (espera-se true)
        Assert.assertNotEquals(o1, o2);

        // Alinha o firstName de o2 com o de o1, tornando todos os campos "relevantes" iguais
        o2.setFirstName("first");

        // Agora os dois objetos devem ser considerados iguais
        Assert.assertEquals(o1, o2);
    }
}
