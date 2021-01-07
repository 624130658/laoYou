package com.lansive.dispatch.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.lansive.dispatch.constant.enums.BaseEnum;

import java.io.IOException;

/**
 * BaseEnum专用序列化
 *
 * @ClassName EnumSerializer
 * @Author YL
 * @Date 2021年1月5日 10:24:06
 **/
public class EnumSerializer extends StdSerializer {

    public EnumSerializer() {
        super(BaseEnum.class);
    }

    public EnumSerializer(Class t) {
        super(t);
    }

    @Override
    public void serialize(Object o, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        BaseEnum baseEnum = (BaseEnum) o;
        jsonGenerator.writeStartObject();
        jsonGenerator.writeFieldName("desc");
        jsonGenerator.writeString(baseEnum.getDesc());
        jsonGenerator.writeFieldName("code");
        jsonGenerator.writeString(baseEnum.getCode().toString());
        jsonGenerator.writeFieldName("field");
        jsonGenerator.writeString(((Enum) baseEnum).name());
        jsonGenerator.writeEndObject();
    }
}
