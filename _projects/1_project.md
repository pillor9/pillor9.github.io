---
layout: page
title: UAV Model Deployment on NVIDIA Jetson
description: Real-time UAV detection using TensorRT and MNN on edge devices with Docker-based deployment pipeline
img: assets/img/1.jpg
importance: 1
category: Edge AI
---

## Overview

This project focuses on deploying deep learning models for **UAV (Unmanned Aerial Vehicle) detection** on **NVIDIA Jetson** edge devices. The goal is to achieve real-time inference performance while maintaining high detection accuracy under resource-constrained conditions.

## Key Technologies

- **TensorRT**: NVIDIA's high-performance deep learning inference optimizer and runtime, used for INT8 quantization and inference acceleration
- **MNN**: Alibaba's lightweight deep learning inference engine, optimized for mobile and edge deployment
- **Docker**: Containerized deployment environment ensuring reproducibility across different Jetson devices
- **CUDA**: GPU-accelerated computing for parallel inference

## Technical Highlights

### Model Optimization Pipeline

1. **Model Training**: Train detection model on GPU workstation
2. **ONNX Export**: Convert trained model to ONNX intermediate representation
3. **TensorRT Optimization**: Apply INT8 quantization and layer fusion via TensorRT
4. **MNN Deployment**: Alternative lightweight deployment using MNN framework
5. **Docker Packaging**: Containerize the entire inference pipeline

### Performance Metrics

| Metric | Before Optimization | After TensorRT INT8 |
|--------|-------------------|---------------------|
| Inference Time | ~50ms | ~12ms |
| Model Size | ~200MB | ~50MB |
| GPU Memory | ~1.5GB | ~0.5GB |

## Docker Environment

The deployment pipeline is fully containerized:

```dockerfile
# Example Dockerfile structure
FROM nvcr.io/nvidia/l4t-tensorrt:rXX.X.X-runtime
# Install dependencies
# Copy optimized model
# Set up inference server
```

## Future Work

- Explore model distillation techniques for further compression
- Implement multi-model ensemble on Jetson Orin
- Add real-time video stream processing pipeline
