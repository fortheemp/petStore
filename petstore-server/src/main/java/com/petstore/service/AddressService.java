package com.petstore.service;

import com.petstore.entity.Address;
import com.petstore.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public List<Address> getByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Address getById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("地址不存在"));
    }

    public Address add(Address address) {
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            addressRepository.clearDefaultByUserId(address.getUserId());
        }
        return addressRepository.save(address);
    }

    public Address update(Address address) {
        Address exist = getById(address.getId());
        if (address.getReceiverName() != null) exist.setReceiverName(address.getReceiverName());
        if (address.getPhone() != null) exist.setPhone(address.getPhone());
        if (address.getProvince() != null) exist.setProvince(address.getProvince());
        if (address.getCity() != null) exist.setCity(address.getCity());
        if (address.getDistrict() != null) exist.setDistrict(address.getDistrict());
        if (address.getDetail() != null) exist.setDetail(address.getDetail());
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            addressRepository.clearDefaultByUserId(exist.getUserId());
            exist.setIsDefault(1);
        }
        return addressRepository.save(exist);
    }

    public void delete(Long id) {
        addressRepository.deleteById(id);
    }

    public void setDefault(Long id) {
        Address address = getById(id);
        addressRepository.clearDefaultByUserId(address.getUserId());
        address.setIsDefault(1);
        addressRepository.save(address);
    }

    public Address getDefault(Long userId) {
        return addressRepository.findByUserIdAndIsDefault(userId, 1);
    }
}