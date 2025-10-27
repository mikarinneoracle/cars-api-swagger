FROM oraclelinux:7-slim

RUN yum update -y && \
    yum install -y gcc-c++ make sudo zip

# Create ORM package

COPY terraform /ci-stack

RUN mkdir /package
RUN cd /ci-stack && zip -r /package/ci-stack.zip .

VOLUME ["/transfer/"]

