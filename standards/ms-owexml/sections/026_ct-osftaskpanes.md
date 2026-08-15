<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_OsfTaskpanes -->

### CT_OsfTaskpanes


*Target namespace: *http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11

*Referenced by: *[taskpanes](#Section_18ce23f8419e48408ae87b41a0aef827)

<a id="CC_e3d7901e000000000000000000000000"></a>A complex type that specifies a list of persisted taskpane objects__.__

*Child Elements:*

<a id="CC_9f33273b000000000000000000000000"></a>__taskpane: __A __CT_OsfTaskpane__ (section [2.2.8](#Section_555d296828234cb3b3174511dfc97bef)) element that specifies the information of a persisted taskpane object.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfTaskpanes">
2.   <xsd:sequence>
3.     <xsd:element name="taskpane" minOccurs="0" maxOccurs="unbounded" type="CT_OsfTaskpane"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.2](#Section_084678b6e1804609966b175e7a9eb31e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
