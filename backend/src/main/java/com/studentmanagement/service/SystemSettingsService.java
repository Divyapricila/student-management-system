package com.studentmanagement.service;

import com.studentmanagement.dto.SystemSettingDTO;
import com.studentmanagement.entity.SystemSetting;
import com.studentmanagement.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SystemSettingsService {

    private final SystemSettingRepository systemSettingRepository;

    public SystemSettingsService(SystemSettingRepository systemSettingRepository) {
        this.systemSettingRepository = systemSettingRepository;
    }

    @Transactional(readOnly = true)
    public String getSetting(String key, String defaultValue) {
        return systemSettingRepository.findBySettingKey(key)
                .map(SystemSetting::getSettingValue)
                .orElse(defaultValue);
    }

    @Transactional
    public SystemSettingDTO updateSetting(String key, String value, String description) {
        SystemSetting setting = systemSettingRepository.findBySettingKey(key)
                .orElse(new SystemSetting(null, key, value, description));
        setting.setSettingValue(value);
        if (description != null) {
            setting.setDescription(description);
        }
        SystemSetting saved = systemSettingRepository.save(setting);
        return new SystemSettingDTO(saved.getSettingKey(), saved.getSettingValue(), saved.getDescription());
    }

    @Transactional(readOnly = true)
    public List<SystemSettingDTO> getAllSettings() {
        return systemSettingRepository.findAll().stream()
                .map(s -> new SystemSettingDTO(s.getSettingKey(), s.getSettingValue(), s.getDescription()))
                .collect(Collectors.toList());
    }
}
