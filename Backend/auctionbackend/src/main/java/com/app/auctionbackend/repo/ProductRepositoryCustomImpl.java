package com.app.auctionbackend.repo;

import com.app.auctionbackend.model.Product;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import java.util.List;

@Repository
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom{

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<Product> getProductsByCategoryId(Integer categoryId) {

        return null;

      // String queryString = "SELECT p FROM subcategory_products AS sub JOIN Product AS p ON ( sub.product_id = p.id) JOIN Subcategory AS s ON ( sub.subcategory_id =s.id ) WHERE s.category_id = :categoryId";


      /*  String queryString = "SELECT p FROM subcategory_products AS sub JOIN product AS p ON ( sub.product_id = p.id) JOIN subcategory AS s ON ( sub.subcategory_id =s.id ) WHERE s.category_id = :categoryId";

        Query query = entityManager.createNativeQuery(queryString, Product.class); //.createQuery(queryString);

        query.setParameter("categoryId",categoryId);
        List resultList = query.getResultList();
        return (List<Product>)resultList;*/


      /*  CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> cq = cb.createQuery(Product.class);
        Root<Product> root = cq.from(Product.class);
        root.fetch("subcategories", JoinType.INNER);
        CriteriaQuery<Product> all = cq.select(root);
        all.where(cb.equal(root.get("subcategories"), categoryId));
        TypedQuery<Product> allQuery = entityManager.createQuery(all);
        return allQuery.getResultList();*/

      /*CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> cq = cb.createQuery(Product.class);
        Root<Product> root = cq.from(Product.class);
        root.fetch("subcategory_products", JoinType.INNER);
        root.fetch("subcategory", JoinType.INNER);  //
        CriteriaQuery<Product> all = cq.select(root);
        all.where(cb.equal(root.get("subcategory"), categoryId));
        TypedQuery<Product> allQuery = entityManager.createQuery(all);
        return allQuery.getResultList();*/

     /*   CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> cq = cb.createQuery(Product.class);
        Root<Product> root = cq.from(Product.class);
        //root.fetch("subcategory_products", JoinType.INNER);
        root.fetch("subcategories", JoinType.INNER);
        CriteriaQuery<Product> all = cq.select(root);
        all.where(cb.equal(root.get("subcategories"), categoryId));
        TypedQuery<Product> allQuery = entityManager.createQuery(all);
        return allQuery.getResultList();*/
    }
}
