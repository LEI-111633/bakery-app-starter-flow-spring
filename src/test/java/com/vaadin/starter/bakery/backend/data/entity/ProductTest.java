package com.vaadin.starter.bakery.backend.data.entity;

import org.junit.Assert;
import org.junit.Test;

public class ProductTest {

	@Test
    public void equalsTest() {
        // Cria o primeiro objeto Product e define seus atributos
        Product o1 = new Product();
        o1.setName("name");    // nome do produto
        o1.setPrice(123);      // preço do produto

        // Cria o segundo objeto Product com um nome diferente
        Product o2 = new Product();
        o2.setName("anothername"); // diferente de o1
        o2.setPrice(123);          // mesmo preço de o1

        // Verifica se os dois objetos são diferentes (espera-se true)
        Assert.assertNotEquals(o1, o2);

        // Alinha o nome de o2 com o de o1, tornando todos os campos iguais
        o2.setName("name");

        // Agora os dois objetos devem ser considerados iguais
        Assert.assertEquals(o1, o2);
    }
}
