export class LocationManager {
    private text = '';

    public append(data: string) {
        this.text += data;
    }

    public getText(): string {
        return this.text;
    }
}
