import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "digimon-split-box",
  template: `
    <div
      class="raise mx-auto flex h-24 w-full max-w-sm cursor-pointer flex-row opacity-90 transition-all"
    >
      <div
        style="-webkit-mask-image: url('../../../assets/images/corner_cut_top_left.svg');
        -webkit-mask-size: 100%;
        "
        [ngStyle]="{ background: 'url(' + image + ')' }"
        class="w-1/2 bg-[#e2e4e6] bg-center bg-no-repeat"
      ></div>
      <div
        style="
              -webkit-mask-image: url('../../../assets/images/corner_cut_bottom_right.svg');
              -webkit-mask-size: 100%;
              -webkit-mask-position: bottom right;
              background: url('../../../assets/images/bg_corner.png') no-repeat right bottom #FFFFFF;
              "
        class="flex w-1/2 flex-col content-center justify-center bg-[#e2e4e6] font-bold"
      >
        <h1>{{ header }}</h1>
        <h2 class="text-sm font-normal">{{ subheader }}</h2>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitBoxComponent {
  @Input() public image: string;
  @Input() public header: string;
  @Input() public subheader: string;
}
