<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_9a710598459041a19c0fb34c63b9866d"></a><a id="_Toc174685994"></a>ST_ZoomObjectImageType

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2016/6/main

*Referenced by: *[CT_ZoomObjectProperties](#Section_059e3722139d4e419841d53eecaf73f6)

<a id="CC_abc0609c000000000000000000000000"></a>A simple type that specifies whether the [__Zoom__](#gt_8ee27f3b-c4c2-4a5d-bd29-4ae700d761b0) object is using the slide preview or a cover image.

Value

Meaning

preview

<a id="CC_2adc4f2c000000000000000000000000"></a>Use the image of the slide or section

cover

<a id="CC_8077c8e4000000000000000000000000"></a>Use a custom image

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_ZoomObjectImageType">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="preview"/>
4.     <xsd:enumeration value="cover"/>
5.   </xsd:restriction>
6. </xsd:simpleType>

See section [5.7](#Section_84585d01dfd5403e923527853aff4d46) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
