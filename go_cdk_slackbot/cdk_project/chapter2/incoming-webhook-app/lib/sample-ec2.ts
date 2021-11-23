import cdk = require("@aws-cdk/core");
import { Vpc, VpnConnection, CfnInstance } from "@aws-cdk/aws-ec2"

export class SampleEc2 extends cdk.Stack {
    /**
     * 
     * @param scope コンパイルとデプロイを担うコードで、@aws-cdk/core » App のインスタンスをここにあてがう。
     * @param id スタックのID
     * @param props スタックのオプション
     */
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // VPCを作成する
        const vpc = new Vpc(this, "ExampleVpc", {
            cidr: "10.0.0.0/16"
        })
        // EC2インスタンスを作成する
        for (let i = 0; i < 3; i++) {
            new CfnInstance(
                /** 
                 * ここで「型 'this' の引数を型 'Construct' のパラメーターに割り当てることはできません。」とエラーが出るなら、
                 * @aws-cdk配下のいずれかのパッケージのバージョン違いが原因。
                 * バージョンを揃えてnode_module再生成をすれば正常になる。
                 * なのでpackage.jsonを確認すること。
                 * 
                 * node_module再生成 => `rm -rf node_modules/ && npm i`
                 * 
                 * 参考：https://wp-kyoto.net/should-check-packagejson-when-npm-run-budil-failed/
                 * 
                 * ちなみに、2021-11-22時点では、なにも考えずにセットアップすると下記のようなバージョン相違が発生していた。
                 * これを双方とも 1.133に固定することで、エラーが解決された
                 * 
                 * ```
                 * "@aws-cdk/aws-ec2": "^1.133.0",
                 * "@aws-cdk/core": "1.130.0",
                 * ```
                 */
                this,
                `CdkTest-${i}`,
                {
                    imageId: "ami-0f9ae750e8274075b",
                    instanceType: "t2.micro",
                    subnetId: vpc.publicSubnets[0].subnetId,
                    securityGroupIds: [vpc.vpcDefaultSecurityGroup],
                    tags: [{
                        key: "Name",
                        value: `cdktest-${i}`
                    }]
                }

            )
        }
    }
}