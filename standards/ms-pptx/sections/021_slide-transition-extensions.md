<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Slide Transition Extensions -->

### Slide Transition Extensions


The __sld__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.38), the __sldLayout__ element ([ISO/IEC29500-1:2016] section 19.3.1.39), and the __sldMaster__ element ([ISO/IEC29500-1:2016] section 19.3.1.42) are extended by the addition of an __AlternateContent __child element ([[ISO/IEC29500-3:2015]](https://go.microsoft.com/fwlink/?linkid=861154) section 7.5), whose structure is specified in the following table.

AlternateContent components

Child element

Choice: http://schemas.microsoft.com/office/powerpoint/2010/main

__transition __([ISO/IEC29500-1:2016] section 19.3.1.50)

Choice:

http://schemas.microsoft.com/office/powerpoint/2012/main

__transition __([ISO/IEC29500-1:2016] section 19.3.1.50)

Choice: 

http://schemas.microsoft.com/office/powerpoint/2015/09/main

__transition __([ISO/IEC29500-1:2016] section 19.3.1.50)

Fallback

__transition __([ISO/IEC29500-1:2016] section 19.3.1.50)

The __transition__ element ([ISO/IEC29500-1:2016] section 19.3.1.50) is extended by the addition of the following child elements to the __xsd:choice__ content model of the __CT_SlideTransition__ complex type ([ISO/IEC29500-1:2016] section A.3):

- __vortex __(section [2.3.1.30](#Section_b12536eae4454d658733be64b70d121f))
- __switch__ (section [2.3.1.29](#Section_3da05579946146e2a1c732fe2092bba6))
- __flip__ (section [2.3.1.11](#Section_02b192a9284c40e5aa3ca89c5f6f66cc))
- __ripple__ (section [2.3.1.24](#Section_c1c9b4f579c04e2f8b59db2b4cee9f00))
- __honeycomb__ (section [2.3.1.15](#Section_e32665f497154c94a28528bff8ef8684))
- __prism__ (section [2.3.1.22](#Section_52f75e750b724e82ab576474229e751c))
- __doors__ (section [2.3.1.7](#Section_71791754bdce43d18bf4eaeccc85d4aa))
- __window__ (section [2.3.1.33](#Section_de20045ad22048b2a3975d37c916d662))
- __ferris__ (section [2.3.1.9](#Section_e326a2fa25bd43a490f2f0356d5f6405))
- __gallery__ (section [2.3.1.13](#Section_7e9eb7c83945419bb3787672b6133425))
- __conveyor__ (section [2.3.1.3](#Section_e0aeee44571e49c8a753e7a8dd2026bb))
- __pan__ (section [2.3.1.21](#Section_801f9e80bbcc414581d3fee8c75a0f1e))
- __glitter__ (section [2.3.1.14](#Section_c78988eeb178452392176d18df30f674))
- __warp__ (section [2.3.1.31](#Section_a3a8b0c3573b403399c46e535ee759f4))
- __flythrough__ (section [2.3.1.12](#Section_71a951a17d6d45779b032fb84632deb2))
- __flash__ (section [2.3.1.10](#Section_67b6b598da79400893f051c45e520057))
- __shred__ (section [2.3.1.28](#Section_f431205506a24e4b81cb9aae921703ed))
- __reveal__ (section [2.3.1.23](#Section_830962fcea324de9b0c5ba5e2a8a9bb3))
- __wheelReverse__ (section [2.3.1.32](#Section_762237347aa74053b666acd5f73d1d9a))
- __morph __(section [2.6.1.1](#Section_68d26d78f7f547ab835d4e6c82ff39f0))
- __prstTrans __(section [2.4.1.5](#Section_e421e750ae5846c19c97dae93f6574e3))

The __transition__ element ([ISO/IEC29500-1:2016] section 19.3.1.50) is further extended by the addition of the following attribute to the __CT_SlideTransition__ complex type ([ISO/IEC29500-1:2016] section A.3): __dur __(section [2.3.2.3](#Section_9032bdb2b273470b8ac4c98a8c944494)).
